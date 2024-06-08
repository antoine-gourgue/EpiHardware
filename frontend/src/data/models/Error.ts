class Error {
    public message: string

    constructor(message: string) {
        this.message = message
    }

    public toJSON() {
        return {
            message: this.message
        }
    }

    public static fromJSON(json: any) {
        return new Error(json.message)
    }
}

export default Error
