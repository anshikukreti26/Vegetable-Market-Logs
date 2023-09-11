// Add this JavaScript code in a separate file, e.g., predict.js

$(document).ready(function () {
    // Handle form submission
    $('#prediction-form').submit(function (e) {
        e.preventDefault();
        const vegetableName = $('#vegetable-name').val();

        // Perform your prediction logic here and send the vegetableName to the server
        $.ajax({
            url: '/predict', // The route for making predictions
            method: 'POST',
            data: { vegetableName: vegetableName },
            success: function (data) {
                // Display the predicted result
                $('#result').text('Predicted Price: ' + data.predictedPrice);
            },
            error: function (error) {
                console.error('Error predicting price:', error);
            }
        });
    });
});
