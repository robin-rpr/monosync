let {Entity, Column} = require('typeorm');

/***
 * @Column: {String} email
 */
@Entity() export class User {
    @Column() email;
}