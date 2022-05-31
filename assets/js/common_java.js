function alert_tikets(number_tickets) {
    if (window.confirm('You have ' + number_tickets + ' tikets to solve. Do you want to go there?'))
    {
        window.location='/agent/tickets';
    };
}
