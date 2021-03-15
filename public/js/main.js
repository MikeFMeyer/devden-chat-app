const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const roomsList = document.getElementById('rooms-list');

const rooms = [
	'javascript',
	'python',
	'golang',
	'java',
	'ruby',
	'php'
];

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });
outputRooms();

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
	outputRoomName(room);
	outputUsers(users);
});

// Message from server
socket.on('message', (message) => {
	outputMessage(message);

	// Scroll down
	chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
	e.preventDefault();

	// Get message text
	let msg = e.target.elements.msg.value;

	msg = msg.trim();

	if (!msg) {
		return false;
	}

	// Emit message to server
	socket.emit('chatMessage', msg);

	// Clear input
	e.target.elements.msg.value = '';
	e.target.elements.msg.focus();
});

// // Output message to DOM
function outputMessage(message) {
	const div = document.createElement('div');
	div.classList.add('flex', 'mx-6', 'my-3', 'py-4', 'border-t', 'border-gray-700', 'flex-col');
	const meta = document.createElement('div');
	meta.innerHTML += `<span class="text-white hover:underline">${message.username}</span>`;
	meta.innerHTML += `<span class="text-xs text-gray-900 ml-2">${message.time}</span>`;
	div.appendChild(meta);
	const chat = document.createElement('p');
	chat.innerText = message.text;
	div.appendChild(chat);
	document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
	roomName.innerText = room;
}

function outputRooms() {
	roomsList.innerHTML = '';
	rooms.forEach((room) => {
		const span = document.createElement('span');
		span.classList.add('mb-2', 'text-gray-500', 'px-2', 'hover:text-gray-200', 'py-2', 'rounded', 'items-center', 'hover:bg-gray-900', 'flex');
		span.innerHTML = `<a href="chat.html?username=${username}&room=${room}" class="flex items-center"><span class="text-xl">#</span><span class="ml-2">${room}</span></a>`;
		roomsList.appendChild(span);
	});
}

// Add users to DOM
function outputUsers(users) {
	userList.innerHTML = '';
	users.forEach((user) => {
		const span = document.createElement('span');
		span.classList.add('mb-2', 'text-gray-200', 'px-2', 'rounded', 'py-2', 'flex', 'items-center');
		span.innerHTML = `<span class="ml-2">${user.username}</span>`;
		userList.appendChild(span);
	});
}
