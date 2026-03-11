import dayjs from "dayjs";

export const generateDate = (month = dayjs().month(), year = dayjs().year()) => {
    const firstDateOfMonth = dayjs().year(year).month(month).startOf("month");
    const lastDateOfMonth = dayjs().year(year).month(month).endOf("month");

    let days = [];

    // Adiciona os dias que antecedem o primeiro dia do mês
    for (let i = 0; i < firstDateOfMonth.day(); i++) {
        days.push({
            date: firstDateOfMonth.subtract(firstDateOfMonth.day() - i, 'days'),
            currentMonth: false,
            today: false
        });
    }

    // Adiciona os dias do mês atual
    for (let day = 0; day < lastDateOfMonth.diff(firstDateOfMonth, 'day') + 1; day++) {
        days.push({
            date: firstDateOfMonth.add(day, 'days'),
            currentMonth: true,
            today: firstDateOfMonth.add(day, 'days').isSame(dayjs(), 'day')
        });
    }

    // Adiciona os dias até completar o último período de 14 dias
    while (days.length % 14 !== 0) {
        days.push({
            date: days[days.length - 1].date.add(1, 'day'),
            currentMonth: false,
            today: false
        });
    }

    // Organiza os dias em períodos de 14 dias
    let periods = [];
    for (let i = 0; i < days.length; i += 14) {
        periods.push(days.slice(i, i + 14));
    }

    return periods;
};

export const months = [
    "JAN",
    "FEV",
    "MAR",
    "ABR",
    "MAI",
    "JUN",
    "JUL", 
    "AGO",
    "SET",
    "OUT",
    "NOV",
    "DEZ",
];

export const daysOfWeek = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
];


