// This will be run when the window loads
window.onload = function() {
    // connect to the server. If no server is given, it will
    // automatically (automajically?) discover the server
    var socket = io.connect();

    // get the elements in the webpage and store them in
    // variables so we don't have to explicitly call them
    // later by their id.
    username = document.getElementById('username-textbox');
    messageBox = document.getElementById('message-textbox');
    sendButton = document.getElementById('send-button');
    content = document.getElementById('content');

    // When we connect to the server
    socket.on('connect', function() {
        // Let the user know, through the chat log
        content.innerHTML += "Connected to server</br>".bold().italics();

        // when we receive something on the message channel
        // For example, if user MonkehParade sends us a message
        // saying 'Hi!'
        socket.on('message', function (data) {
            // we output it for debugging purposes
            // create an empty html variable
            var html = '';
            console.log(data);
            // if the packet contains a message
            if (data.message) {
                // check to see if it contains a username
                if (data.username) {
                    // if it does, we append the username to it with a colon
                    // MonkehParade:
                    html += data.username.bold() + ": ";
                } else {
                    // if there is no username, we append "Server" to it.
                    html += "Server: ".bold().italics();
                }
                // Shortened version (without the formatting)
                // html += data.username ? html += data.username + ": " : html += "Server: ";
                // and then we append the message to the variable with an html break
                html += data.message + "</br>";
            }
            // We output the message for debugging purposes
            console.log(html);
            // At this point, the 'html' will contain something like this
            // MonkehParade: Hi!</br>
            // We add that inside the content div
            content.innerHTML += html;
            // scroll to the bottom
            content.scrollTop = content.scrollHeight;

        });
    });

    // and if we disconnect
    socket.on("disconnect", function(){
        // Let the user know, through the chat log
        content.innerHTML += "Disconnected from server</br>".bold().italics();
    });

    // When the send button is clicked
    sendButton.onclick = function(){
        // we get the value that is inside the message text box
        // we trim() it to remove any excess whitespace
        var messageToSend = messageBox.value.trim();
        // and the value inside the username text box
        var user = username.value.trim();
        // if the user hasn't entered a nickname, let them know
        if(user === ''){
            alert('Tell me your name, stranger!');
        // likewise if they haven't entered a message
        } else if (messageToSend === ''){
            alert('I know silence is golden, but not in this context.');
        } else {
            // we send the message through the 'message' channel
            // with the user's nickname and the message
            socket.emit( 'message',
                {
                    username: user,
                    message: messageToSend
                }
            );
            // and empty the message text box
            messageBox.value = null;

            // we disable the username textbox so the user can't
            // change the nickname after the message is sent
            username.setAttribute("disabled", true);
        }
    };
};