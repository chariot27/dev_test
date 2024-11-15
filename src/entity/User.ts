export class User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;

    constructor(id: number, firstname: string, lastname: string, email: string) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
    }
}