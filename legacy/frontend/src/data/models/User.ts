class User {
    public login: string
    public password: string
    public firstname: string
    public lastname: string
    public email: string
    public token: string|null = null

    constructor(login: string, password: string, firstname: string, lastname: string, email: string) {
        this.login = login
        this.password = password
        this.firstname = firstname
        this.lastname = lastname
        this.email = email
    }

    public toJSON() {
        return {
            login: this.login,
            password: this.password,
            firstname: this.firstname,
            lastname: this.lastname,
            email: this.email
        }
    }

    public static fromJSON(json: any) {
        return new User(json.login, json.password, json.firstname, json.lastname, json.email)
    }
}

export default User
