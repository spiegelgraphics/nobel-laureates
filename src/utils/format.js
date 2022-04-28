import { timeParse, formatDefaultLocale, timeFormatDefaultLocale, timeFormat } from 'd3';

export const NA_STRING = '—';
export const CURRENCY_FORMAT = '$,.0f';
export const PERCENT_FORMAT = '.1%';
export const INTEGER_FORMAT = ',.0f';
export const FLOAT_FORMAT = ',.1f';

// the basic formatting function sued
const p = {
    ...formatDefaultLocale,
    decimal: '.',
    currency: ['', '  €'],
    percent: ' %',
    nan: NA_STRING,
    thousands: ',',
    grouping: [3],
};
  
export const formatTime = timeFormatDefaultLocale({
    ...p,
    dateTime: '%a %b %e %X %Y',
    date: '%d.%m.%Y',
    time: '%H:%M:%S',
    periods: ['AM', 'PM'],
    days: [
        'Sonntag',
        'Montag',
        'Dienstag',
        'Mittwoch',
        'Donnerstag',
        'Freitag',
        'Samstag',
    ],
    shortDays: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    months: [
        'Januar',
        'Februar',
        'März',
        'April',
        'Mai',
        'Juni',
        'Juli',
        'August',
        'September',
        'Oktober',
        'November',
        'Dezember',
    ],
    shortMonths: [
        'Jan',
        'Feb',
        'Mär',
        'Apr',
        'Mai',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Okt',
        'Nov',
        'Dez',
    ]
}).format;

const indicatorFormats = {
    'year': timeFormat('%Y'),
    'month-short': timeFormat('%b'),
    'month-year': timeFormat('%b %Y'),
    'day-month-year': timeFormat('%d. %B %Y')
};

export const formatValue = (value, indicatorId) => {
    const formatter = indicatorFormats[indicatorId];
    return formatter(value);
};

export const parseDate = timeParse('%d.%m.%y');

export const formatPartyKeys = (obj) => {
    const keys = Object.keys(obj);
    let key;
    let n = keys.length;
    let newobj = {};
    while (n--) {
        key = keys[n];
        if (key === 'CDU' || key === 'CSU') key = 'CDU/CSU';
        newobj[key.toUpperCase()] = obj[key];
    }
    return newobj;
};