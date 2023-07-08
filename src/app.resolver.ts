/* eslint-disable @typescript-eslint/no-unused-vars */
import * as date from 'date-fns';
import * as lodash from 'lodash';
import { InternalServerErrorException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Queue } from 'bull';

import { PatientSchedulesInput } from './calendar/dto/patient-schedules.input';
import { ScheduleMonthlyInput } from './calendar/dto/schedule-monthly.input';
import { NewCalendarInput } from './calendar/dto/new-calendar.input';
import { Calendar } from './calendar/models/calendar.model';
import { CalendarService } from './calendar/calendar.service';
import { DoctorService } from './doctors/doctors.service';

@Resolver((of) => Calendar)
export class AppResolver {
  constructor(
    @InjectQueue('calendars') private readonly calendarsQueue: Queue,
    private readonly amqpConnection: AmqpConnection,
    private readonly calendarService: CalendarService,
    private readonly doctorService: DoctorService,
  ) {}

  @Query((returns) => [String])
  async patientSchedules(
    @Args('patientSchedulesData') patientSchedulesInput: PatientSchedulesInput,
  ): Promise<string[]> {
    const args = patientSchedulesInput;
    const calendars = await this.calendarService.findAll();
    let filteredCalendars = [];

    if (args.doctor)
      filteredCalendars = [
        ...filteredCalendars,
        ...calendars.filter((_) =>
          _.schedules.some(
            (__) =>
              __.doctor.name === args.doctor ||
              __.doctor.email === args.doctor ||
              __.doctor.id === args.doctor,
          ),
        ),
      ];

    if (args.patient)
      filteredCalendars = [
        ...filteredCalendars,
        ...calendars.filter((_) =>
          _.schedules.some(
            (__) =>
              __.patient.email === args.patient.email ||
              __.patient.name === args.patient.name ||
              __.patient.phone === args.patient.phone,
          ),
        ),
      ];

    let transformCalendars = filteredCalendars.length ? filteredCalendars : [];

    if (!args.doctor && !args.patient)
      transformCalendars = [...transformCalendars, ...calendars];

    return transformCalendars.map((_) => {
      const now = new Date();
      now.setHours(_.hour);
      now.setMinutes(_.minute);
      now.setSeconds(0);
      now.setMilliseconds(0);
      now.setDate(_.day);
      now.setMonth(_.month - 1);
      now.setFullYear(_.year);
      return `Appointment scheduled for ${date.format(
        now,
        'MMMM d',
      )} at ${date.format(now, 'h:mmaaa')} with Dr. ${_.schedules
        .map((__) => __.doctor.name)
        .join(', ')}. Patient ${_.schedules
        .map(
          (__) =>
            `${__.patient.name}(email: ${__.patient.email} | phone: ${__.patient.phone})`,
        )
        .join(', ')}`;
    });
  }

  @Query((returns) => [String])
  async doctorScheduleMonthly(
    @Args('scheduleMonthlyData') scheduleMonthlyData: ScheduleMonthlyInput,
  ): Promise<string[]> {
    const args = scheduleMonthlyData;
    const now = new Date();

    if (args.hour) now.setHours(args.hour);
    if (args.minute) now.setMinutes(args.minute);
    if (args.day) now.setDate(args.day);
    if (args.month) now.setMonth(args.month - 1);
    if (args.year) now.setFullYear(args.year);

    now.setSeconds(0);
    now.setMilliseconds(0);

    const scheduleMonthly = date.eachDayOfInterval({
      start: now,
      end: date.addDays(now, 31),
    });
    const calendars = await this.calendarService.findAll();
    const doctors = await this.doctorService.findAll();
    const agenda = [];
    let i = 0;

    for (; i < scheduleMonthly.length; i++) {
      const schedule = scheduleMonthly[i];
      const available = calendars.filter(
        (_) =>
          _.hour === schedule.getHours() ||
          (_.hour === schedule.getHours() &&
            _.minute === schedule.getMinutes()) ||
          (_.month - 1 === schedule.getMonth() && _.day === schedule.getDate()),
      );

      if (available.length <= 0)
        agenda.push(
          `Day ${schedule.getDate()} of Month ${
            schedule.getMonth() + 1
          } is free for scheduling from 9am to 6pm.`,
        );
    }

    i = 0;

    for (; i < doctors.length; i++) {
      const doctor = doctors[i];
      const doctorSchedules = calendars.map((_) => ({
        hour: _.hour,
        minute: _.minute,
        day: _.day,
        month: _.month,
        year: _.year,
        schedules: _.schedules
          .map((__) => (__.doctor.id === doctor.id ? __ : null))
          .filter((__) => __ !== null),
      }));
      const remainingTime = [];
      let i2 = 0;

      for (; i2 < doctorSchedules.length; i2++) {
        const doctorSchedule = doctorSchedules[i2];
        remainingTime.push(
          ...date
            .eachHourOfInterval({
              start: now,
              end: date.addMinutes(
                now,
                date.hoursToMinutes(9) + (args.minute || 0),
              ),
            })
            .filter((_) => _.getHours() >= 9 && _.getHours() < 18)
            .filter((_) => {
              const interval = date.intervalToDuration({
                start: _,
                end: (() => {
                  const __ = new Date();
                  __.setHours(doctorSchedule.hour);
                  __.setMinutes(doctorSchedule.minute);
                  __.setSeconds(0);
                  __.setMilliseconds(0);
                  __.setDate(doctorSchedule.day);
                  __.setMonth(doctorSchedule.month - 1);
                  __.setFullYear(doctorSchedule.year);
                  return __;
                })(),
              });
              return interval.hours >= 1 && interval.minutes <= 0;
            })
            .filter(
              (_) =>
                !(
                  _.getMonth() === doctorSchedule.month - 1 &&
                  _.getDate() === doctorSchedule.day &&
                  (_.getHours() === doctorSchedule.hour ||
                    (_.getHours() === doctorSchedule.hour &&
                      _.getMinutes() === doctorSchedule.minute)) &&
                  doctorSchedule.schedules.length
                ),
            ),
        );
      }

      if (doctorSchedules.filter((_) => _.schedules.length >= 8).length)
        agenda.push(
          `Doctor ${doctor.name} is unavailable for scheduling. He completed the day's agenda!`,
        );

      if (doctorSchedules.filter((_) => _.schedules.length < 8).length)
        agenda.push(
          `Doctor ${doctor.name} is available for scheduling. ${
            8 -
            doctorSchedules.reduce(
              (accumulator, currentValue) =>
                accumulator + currentValue.schedules.length,
              0,
            )
          } remaining schedules.`,
        );

      const uniqRemainingTime = lodash.uniqWith(remainingTime, lodash.isEqual);

      if (uniqRemainingTime.length)
        agenda.push(
          `Doctor ${doctor.name} is available at ${uniqRemainingTime
            .map((__) => `${date.format(__, 'dd/MM/yyyy p')}`)
            .join(', ')}`,
        );
      else agenda.push(`Doctor ${doctor.name} closed the agenda for today!`);
    }

    return agenda.length
      ? lodash.uniqWith(agenda, lodash.isEqual)
      : [`Sorry it seems that our system was not able to design a schedule.`];
  }

  @Mutation((returns) => String)
  async addSchedule(
    @Args('newScheduleData') newScheduleData: NewCalendarInput,
  ): Promise<string> {
    const args = newScheduleData;
    const now = new Date();

    now.setHours(args.hour);
    now.setMinutes(args.minute);
    now.setSeconds(0);
    now.setMilliseconds(0);
    now.setDate(args.day);
    now.setMonth(args.month - 1);
    now.setFullYear(args.year);

    const isSunday = date.isSunday(now);
    const isSaturday = date.isSaturday(now);

    if (args.hour < 9 || args.hour > 18)
      throw new InternalServerErrorException(
        'Sorry our doctors are open from 9am to 6pm.',
      );

    if (isSunday || isSaturday)
      throw new InternalServerErrorException(
        'Sorry our doctors only work on weekdays.',
      );

    const doctors = await this.doctorService.findAll();
    const doctorsCount = doctors.length;
    const calendars = (await this.calendarService.findAll()).filter(
      (calendar) =>
        calendar.hour === args.hour ||
        (calendar.hour === args.hour && calendar.minute === args.minute) ||
        (calendar.month === args.month &&
          calendar.day === args.day &&
          calendar.year === args.year),
    );

    if (doctorsCount <= 0)
      throw new InternalServerErrorException(
        'Sorry, we have no doctors available at the moment.',
      );

    const messageData = {
      calendars,
      doctors,
      args,
    };

    await this.calendarsQueue.add('create', messageData);
    await this.amqpConnection.publish('exchange1', 'routing-key', messageData);

    return `We have successfully registered your request.`;
  }
}
