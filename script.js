const scheduleUrl = 'https://api.npoint.io/ebaae45b7ae32de21578';

const bellSchedule = {
    1: { start: '8:24 AM', end: '9:31 AM' },
    2: { start: '9:36 AM', end: '10:43 AM' },
    3: { start: '10:48 AM', end: '11:55 AM' },
    4: { start: '12:41 PM', end: '1:48 PM' },
    5: { start: '1:53 PM', end: '3:00 PM' }
};

let startDate = new Date('2024-10-24');
let startDayLetter = 'D';
let letterDay;

function getLetterDay() {
    if (localStorage.getItem('savedDate') && localStorage.getItem('savedLetter')) {
        startDate = new Date(localStorage.getItem('savedDate'));
        startDayLetter = localStorage.getItem('savedLetter');
    } else {
        startDate = new Date('2024-10-24');
        startDayLetter = 'D';
    }

    const daysOfWeek = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const dayIndex = daysOfWeek.indexOf(startDayLetter);

    const today = new Date();
    let weekdaysCount = 0;

    while (startDate < today) {
        if (startDate.getDay() !== 0 && startDate.getDay() !== 6) {
            weekdaysCount++;
        }
        startDate.setDate(startDate.getDate() + 1);
    }

    if (startDate.getDay() !== 0 && startDate.getDay() !== 6) {
        weekdaysCount--;  // Subtract the last increment if it overshot
    }

    letterDay = daysOfWeek[(dayIndex + weekdaysCount) % daysOfWeek.length];
    $('#letterDay').text(`Today is a ${letterDay} day, here's your schedule:`);
    renderHTML();
}
getLetterDay();

$('#changeLetter').on('click', function () {
    const letter = prompt("Enter a letter (A-G):").toUpperCase();

    if (!['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(letter)) {
        alert("Invalid letter. Please enter A, B, C, D, E, F, or G.");
        return;
    }

    const currentDate = new Date();
    localStorage.setItem('savedDate', currentDate);
    localStorage.setItem('savedLetter', letter);
    getLetterDay()
});

function renderHTML() {
    $.ajax({
        type: "GET",
        url: scheduleUrl,
        success: function (data) {
            const schedule = data.schedule;
            const daySchedule = schedule.filter(item =>
                item.days.includes(letterDay)
            );
            $('#scheduleList').empty();

            let i = 1;
            daySchedule.forEach(element => {
                const time = bellSchedule[i];
                let htmlString = `
                <tr id="row${i}">
                <td>${time.start} to ${time.end}</td>
                </tr>
                `;
                $('#scheduleList').append(htmlString);
                let htmlString2 = `
                <td>${element.period}</td>
                <td>${element.class}</td>
                <td>${element.teacher}</td>
                <td>${element.room}</td>
                `;
                addToArray(element.period, htmlString2);
                i++;
            });
        },
        error: function () {
            alert('Error occurred while retrieving data, please reload the page and try again.');
        }
    });
}

let classArray = [];

function addToArray(period, info) {
    classArray.push({ period: period, info: info });
    if (classArray.length === 5) {
        let order = [];
        if (letterDay === 'A') {
            order = [1, 2, 3, 5, 6];
        } else if (letterDay === 'B') {
            order = [4, 1, 2, 7, 5];
        } else if (letterDay === 'C') {
            order = [3, 4, 1, 6, 7];
        } else if (letterDay === 'D') {
            order = [2, 3, 4, 5, 6];
        } else if (letterDay === 'E') {
            order = [1, 2, 3, 7, 5];
        } else if (letterDay === 'F') {
            order = [4, 1, 2, 6, 7];
        } else if (letterDay === 'G') {
            order = [3, 4, 7, 5, 6];
        }

        classArray.sort((a, b) => {
            return order.indexOf(a.period) - order.indexOf(b.period);
        });

        let i = 1;
        classArray.forEach(element => {
            $(`#row${i}`).append(element.info);
            i++;
        });
        classArray = [];
    }
}
