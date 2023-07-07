import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import { CalendarService } from '../calendar/calendar.service';
import { CreateLogFactory } from '../logs/factories/create-log.factory';
import { Log } from '../logs/models/log.model';

@Processor('calendars')
export class CalendarProcessor {
  private readonly logger = new Logger(CalendarProcessor.name);

  constructor(
    @InjectModel(Log.name) private logModel: Model<Log>,
    private readonly calendarService: CalendarService,
  ) {}

  private _startMessage(job: Job) {
    return `Job(${
      job.name
    }): Job started at ${new Date().toLocaleTimeString()}`;
  }

  private _endMessage(job: Job) {
    return `Job(${job.name}): Job ended at ${new Date().toLocaleTimeString()}`;
  }

  @Process('create')
  async handleTranscode(job: Job) {
    this.logger.log(this._startMessage(job));

    const { calendars, doctors, args } = job.data;
    const stringifyJobData = JSON.stringify(job.data, null, 2);

    if (calendars.length <= 0) {
      const doctor = doctors.at(0);
      const createdCalendar = await this.calendarService.create(args);

      if (createdCalendar instanceof Error) {
        this.logger.log(this._endMessage(job));
        return await CreateLogFactory.run(
          {
            title: `Error on create schedule to ${args.patient.name}(email: ${args.patient.email} | phone: ${args.patient.phone})`,
            message:
              'Sorry it was not possible to create our agenda from your schedule.',
            details: stringifyJobData,
          },
          this.logModel,
        );
      }

      const updatedCalendar = await this.calendarService.update(
        createdCalendar.id,
        {
          schedules: [
            ...createdCalendar.schedules,
            { doctor, patient: args.patient },
          ],
        },
      );

      if (updatedCalendar instanceof Error) {
        this.logger.log(this._endMessage(job));
        return await CreateLogFactory.run(
          {
            title: `Error on update schedule to ${args.patient.name}(email: ${args.patient.email} | phone: ${args.patient.phone})`,
            message:
              'Sorry it was not possible to update our agenda from your schedule.',
            details: stringifyJobData,
          },
          this.logModel,
        );
      }

      this.logger.log(this._endMessage(job));
      return await CreateLogFactory.run(
        {
          title: `Success on create schedule to ${args.patient.name}(email: ${args.patient.email} | phone: ${args.patient.phone})`,
          message: `Your appointment has been stored successfully. You are going to see the doctor ${doctor.name} at ${args.hour}:${args.minute}.`,
          details: stringifyJobData,
        },
        this.logModel,
      );
    }

    if (
      calendars.filter((calendar) =>
        calendar.schedules.some(
          (schedule) => schedule.patient.email === args.patient.email,
        ),
      )
    ) {
      this.logger.log(this._endMessage(job));
      return await CreateLogFactory.run(
        {
          title: `Error on create schedule to ${args.patient.name}(email: ${args.patient.email} | phone: ${args.patient.phone})`,
          message:
            'It seems that you already have an appointment scheduled on that date/time.',
          details: stringifyJobData,
        },
        this.logModel,
      );
    }

    if (
      calendars.every(
        (calendar) =>
          calendar.schedules.filter((schedule) =>
            doctors.every((doctor) => doctor.id === schedule.doctor.id),
          ).length,
      )
    )
      return await CreateLogFactory.run(
        {
          title: `Error on create schedule to ${args.patient.name}(email: ${args.patient.email} | phone: ${args.patient.phone})`,
          message:
            'Sorry but all our doctors are booked on the same date/time.',
          details: stringifyJobData,
        },
        this.logModel,
      );

    const doctor = doctors.find(
      (doctor) =>
        calendars.filter((calendar) =>
          calendar.schedules.find(
            (schedule) => schedule.doctor.id === doctor.id,
          ),
        ).length <= 0,
    );

    if (!doctor)
      return await CreateLogFactory.run(
        {
          title: `Error on create schedule to ${args.patient.name}(email: ${args.patient.email} | phone: ${args.patient.phone})`,
          message: `Sorry we can't fit your appointment into our schedules.`,
          details: stringifyJobData,
        },
        this.logModel,
      );

    const calendar = calendars
      .sort((prev, next) =>
        prev.schedules.length < next.schedules.length ? -1 : 0,
      )
      .at(0);

    if (!calendar)
      return await CreateLogFactory.run(
        {
          title: `Error on create schedule to ${args.patient.name}(email: ${args.patient.email} | phone: ${args.patient.phone})`,
          message:
            'Sorry it was not possible to complete your appointment at this date/time.',
          details: stringifyJobData,
        },
        this.logModel,
      );

    const result = await this.calendarService.update(calendar.id, {
      schedules: [...calendar.schedules, { doctor, patient: args.patient }],
    });

    if (result instanceof Error)
      return await CreateLogFactory.run(
        {
          title: `Error on stored schedule to ${args.patient.name}(email: ${args.patient.email} | phone: ${args.patient.phone})`,
          message: 'Sorry your appointment cannot be stored at this date/time.',
          details: stringifyJobData,
        },
        this.logModel,
      );

    return await CreateLogFactory.run(
      {
        title: `Success on stored schedule to ${args.patient.name}(email: ${args.patient.email} | phone: ${args.patient.phone})`,
        message: `Your appointment has been stored successfully. You are going to see the doctor ${doctor.name} at ${args.hour}:${args.minute}.`,
        details: stringifyJobData,
      },
      this.logModel,
    );
  }
}
