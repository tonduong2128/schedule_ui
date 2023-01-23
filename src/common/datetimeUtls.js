import moment from 'moment';

const DD_MM_YYYY = 'DD/MM/YYYY';
const MM_DD_YYYY = 'MM/DD/YYYY';
const dd_DD_MM = 'dd,DD/MM';

export function getDateString(date = new Date()) {
  return moment(date).format(DD_MM_YYYY);
}
export function getMonthDateString(date = new Date()) {
  return moment(date,DD_MM_YYYY).format(MM_DD_YYYY);
}

export function getDayString(date = new Date()) {
  return moment(date, DD_MM_YYYY).format(dd_DD_MM);
}

export function checkBeforeDate(startDate, endDate, compareDate) {
    const targetDateMoment = moment(compareDate);
    return moment(startDate).isBefore(targetDateMoment, 'date') && moment(endDate).isBefore(targetDateMoment, 'date');
}

export function checkAfterDate(startDate, endDate, compareDate) {
    const targetDateMoment = moment(compareDate);
    return moment(startDate).isAfter(targetDateMoment, 'date') && moment(endDate).isAfter(targetDateMoment, 'date');
}
