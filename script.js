const scheduleUrl = 'https://api.npoint.io/ebaae45b7ae32de21578'

const bellSchedule = {
    1: { start: '8:24 AM', end: '9:31 AM' },
    2: { start: '9:36 AM', end: '10:43 AM' },
    3: { start: '10:48 AM', end: '11:55 AM' },
    4: { start: '12:41 PM', end: '1:48 AM' },
    5: { start: '1:53 PM', end: '3:00 AM' }
}

$('#submitDay').on('click', function () {
    const selectedDay = $('#dayInput').val().toUpperCase()

    if (!['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(selectedDay)) {
        alert('Please enter a valid day (A-G)')
        return
    }

    $.ajax({
        type: "GET",
        url: scheduleUrl,
        success: function (data) {
            const schedule = data.schedule
            const daySchedule = schedule.filter(item =>
                item.days.includes(selectedDay)
            )
            $('#scheduleList').empty()

            let i = 1
            daySchedule.forEach(element => {
                const time = bellSchedule[i]
                let htmlString = `
                <tr id="row${i}">
                <td>${time.start} to ${time.end}</td>
                </tr>
                `
                $('#scheduleList').append(htmlString);
                let htmlString2 = `
                <td>${element.period}</td>
                <td>${element.class}</td>
                <td>${element.teacher}</td>
                <td>${element.room}</td>
                `
                addToArray(element.period, htmlString2)
                i++
            });
        },
        error: function () {
            alert('Error occurred while retrieving data, please reload the page and try again.')
        }
    });
})

let classArray = []

function addToArray(period, info) {
    classArray.push({ period: period, info: info })
    if (classArray.length === 5) {
        let order = []
        if ($('#dayInput').val().toUpperCase() === 'A') {
            order = [1, 2, 3, 5, 6]
        } else if($('#dayInput').val().toUpperCase() === 'B') {
            order = [4, 1, 2, 7, 5]
        } else if($('#dayInput').val().toUpperCase() === 'C') {
            order = [3, 4, 1, 6, 7]
        } else if($('#dayInput').val().toUpperCase() === 'D') {
            order = [2, 3, 4, 5, 6]
        } else if($('#dayInput').val().toUpperCase() === 'E') {
            order = [1, 2, 3, 7, 5]
        } else if($('#dayInput').val().toUpperCase() === 'F') {
            order = [4, 1, 2, 6, 7]
        } else if($('#dayInput').val().toUpperCase() === 'G') {
            order = [3, 4, 7, 5, 6]
        }
        classArray.sort((a, b) => {
            return order.indexOf(a.period) - order.indexOf(b.period);
        });
        let i = 1
        classArray.forEach(element => {
            $(`#row${i}`).append(element.info); // this line is the problem
            i++
        });
        classArray = []
    }
}