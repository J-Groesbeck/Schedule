const scheduleUrl = 'https://api.npoint.io/ee538edca0550b4db30f'

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

            daySchedule.forEach(element => {
                const per = element.period
                const time = bellSchedule[per]
                let htmlString = `
                <tr>
                <td>${per}</td>
                <td>${time.start} to ${time.end}</td>
                <td>${element.class}</td>
                <td>${element.teacher}</td>
                <td>${element.room}</td>
                </tr>
                `
                $('#scheduleList').append(htmlString);
            });
        },
        error: function () {

        }
    });
})