let {Entity, Column} = require('typeorm');

/***
 * @Column: {String} id
 */
@Entity() export class Issue {
    @Column() id;
}