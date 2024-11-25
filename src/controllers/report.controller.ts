import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { generateReport } from '../lib/reports/generator'
import { scheduleReport, unscheduleReport } from '../lib/reports/scheduler'
import { exportToPDF, exportToExcel, exportToCSV } from '../lib/reports/export'
import { ApiError } from '../utils/errors'
import type { ReportConfig } from '../types/report'

export const createReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const config = req.body as ReportConfig
    const userId = req.user!.id

    // Validate location access
    const locations = await prisma.location.findMany({
      where: {
        id: { in: config.locationIds },
        users: { some: { id: userId } }
      }
    })

    if (locations.length !== config.locationIds.length) {
      throw new ApiError('Invalid location access', 403)
    }

    const report = await prisma.report.create({
      data: {
        userId,
        config,
        status: 'active'
      }
    })

    if (config.schedule?.enabled) {
      await scheduleReport(report)
    }

    res.status(201).json({
      message: 'Report created successfully',
      data: report
    })
  } catch (error) {
    next(error)
  }
}

export const getReports = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.report.count({
        where: { userId }
      })
    ])

    res.json({
      data: reports,
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

export const generateReportNow = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const { format } = req.query

    const report = await prisma.report.findFirst({
      where: {
        id,
        userId: req.user!.id
      }
    })

    if (!report) {
      throw new ApiError('Report not found', 404)
    }

    const result = await generateReport(report.config)

    let exportedReport
    switch (format) {
      case 'pdf':
        exportedReport = await exportToPDF({
          title: report.config.name,
          data: result,
          config: report.config
        })
        res.setHeader('Content-Type', 'application/pdf')
        break
      case 'excel':
        exportedReport = await exportToExcel({
          title: report.config.name,
          data: result,
          config: report.config
        })
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        break
      case 'csv':
        exportedReport = await exportToCSV({
          title: report.config.name,
          data: result,
          config: report.config
        })
        res.setHeader('Content-Type', 'text/csv')
        break
      default:
        return res.json({ data: result })
    }

    if (exportedReport) {
      res.setHeader('Content-Disposition', `attachment; filename="${report.config.name}.${format}"`)
      return res.send(exportedReport)
    }

    res.json({ data: result })
  } catch (error) {
    next(error)
  }
}

export const updateReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const updates = req.body as Partial<ReportConfig>
    const userId = req.user!.id

    const report = await prisma.report.findFirst({
      where: {
        id,
        userId
      }
    })

    if (!report) {
      throw new ApiError('Report not found', 404)
    }

    // If schedule is being updated
    if (updates.schedule) {
      if (!updates.schedule.enabled) {
        unscheduleReport(id)
      } else {
        const updatedReport = {
          ...report,
          config: {
            ...report.config,
            schedule: updates.schedule
          }
        }
        await scheduleReport(updatedReport)
      }
    }

    const updatedReport = await prisma.report.update({
      where: { id },
      data: {
        config: {
          ...report.config,
          ...updates
        }
      }
    })

    res.json({
      message: 'Report updated successfully',
      data: updatedReport
    })
  } catch (error) {
    next(error)
  }
}

export const deleteReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const userId = req.user!.id

    const report = await prisma.report.findFirst({
      where: {
        id,
        userId
      }
    })

    if (!report) {
      throw new ApiError('Report not found', 404)
    }

    if (report.config.schedule?.enabled) {
      unscheduleReport(id)
    }

    await prisma.report.delete({
      where: { id }
    })

    res.json({
      message: 'Report deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}