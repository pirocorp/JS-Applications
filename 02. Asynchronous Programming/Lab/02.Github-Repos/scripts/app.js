function loadRepos() {	
	const reposElement = document.getElementById('repos');

	const username = document.getElementById('username').value;
	const url = `https://api.github.com/users/${username}/repos`;

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
		reposElement.innerHTML = '';
		
		for (const repo of data) {
			const repoElement = document.createElement('li');

			const repoLink = document.createElement('a');
			repoLink.href = repo.html_url;
			repoLink.textContent = repo.full_name;

			repoElement.appendChild(repoLink);
			reposElement.appendChild(repoElement);
		}
	}

	function handleError(error) {
		reposElement.innerHTML = '';
		reposElement.textContent = `${error.message} `;
	}
}