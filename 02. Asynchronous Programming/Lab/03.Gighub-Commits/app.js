function loadCommits() {
    const commitsElement = document.getElementById('commits');

	const username = document.getElementById('username').value;
	const repository = document.getElementById('repo').value;
	const url = `https://api.github.com/repos/${username}/${repository}/commits`;

	fetch(url)
		.then(res => {
			if(res.ok == false) {
				throw new Error(`${res.status} ${res.statusText}`);
			}

			return res.json();
		})
		.then(handleResponse) // -> onResolve in promise
		.catch(handleError); // onReject in promise

	function handleResponse(data) {
		commitsElement.innerHTML = '';
		
		for (let commit of data) {
			const commitElement = document.createElement('li');

			commit = commit.commit

			commitElement.textContent = `${commit.author.name}: ${commit.message}`;

			commitsElement.appendChild(commitElement);
		}
	}

	function handleError(error) {
		commitsElement.innerHTML = '';
		commitsElement.textContent = `${error.message} `;
	}
}