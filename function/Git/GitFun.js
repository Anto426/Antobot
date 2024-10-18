class GitFun {
    constructor() {
    }

    FetchDataUSER(user) {
        return new Promise((resolve, reject) => {
            try {
                fetch(`https://api.github.com/users/${user}`, {
                    headers: {
                        'Authorization': process.env.GITHUB_TOKEN
                    }
                })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return res.json();
                })
                .then(data => {
                    resolve(data);
                })
                .catch(error => {
                    reject(error);
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = {
    GitFun
}
