let request = require("supertest")
let app = require("../server")

describe("GET /contacts",()=>{
    it("should return list of contacts",(done)=>{
        request(app).get("/contacts")
            .expect(200)
            .then((res)=>{
                let contacts = res.body
                expect(contacts).toBeInstanceOf(Array) //ตรวจว่า เป็น Array หรือไม่
                expect(contacts).toHaveLength(12) //ตรวจสอบว่าข้อมูล ครบหรือไม่

                let contact = contacts[0]
                //------- เช็คโครงสร้างข้อมูล ของ คนที่ 0 ---------
                expect(contact).toHaveProperty("id")
                expect(contact).toHaveProperty("name")
                expect(contact).toHaveProperty("email")
                expect(contact).toHaveProperty("phone")
                expect(contact).toHaveProperty("url")
                expect(contact).toHaveProperty("notes")
                done()
                
            })
    })
})
describe("GET /contacts/:id", () => {
    it("should return contact id = 0 #if when call /contacts/0", (done) => {
        request(app).get("/contacts/0")
            .expect(200)
            .then((res) => {
                let contact = res.body
                //เช็ค contact ที่ return มา เป็น contact id = 0 หรือไม่
                expect(contact).toEqual({id: 0, name: 'Ned Stark', email: 'ned@winterfell.com', phone: '123-456-7890', url: 'www.google.com', notes: 'Winter is coming.'})
                done()
            })
    })
    it("should return contact id = 1 #if when call /contacts/1", (done) => {
        request(app).get("/contacts/1")
            .expect(200)
            .then((res) => {
                let contact = res.body
                //เช็ค contact ที่ return มา เป็น contact id = 1 หรือไม่
                expect(contact.id).toBeTruthy()
                expect(contact).toEqual( {id: 1, name: 'Theon Greyjoy', email: 'tgreyjoy@winterfell.com', phone: '123-456-7890', url: 'www.google.com', notes: 'Reluctant to pay iron price.'})
                done()
            })
    })
})
describe("POST /contacts", () => {
    it(`should return http status '201' and contact to send 
        #if when send contact to /contacts method post`, (done) =>{
        let sendContact = {
                name: 'www', 
                email: 'www@www.com', 
                phone: '123-456-7890', 
                url: 'www.google.com', 
                notes: 'www'
            }
            
        request(app).post("/contacts")
            .send(sendContact)
            .expect(201)
            .then((res) => {
                let reciveContact = res.body

                //เช็คว่า Api return contact ที่ส่งไปกลับมาหรือเปล่า แล้วส่งกลับมา ถูกต้อง หรือ ไม่
                expect(reciveContact).toHaveProperty("id",12)
                expect(reciveContact).toHaveProperty("name",sendContact.name)
                expect(reciveContact).toHaveProperty("email",sendContact.email)
                expect(reciveContact).toHaveProperty("phone",sendContact.phone)
                expect(reciveContact).toHaveProperty("url",sendContact.url)
                expect(reciveContact).toHaveProperty("notes",sendContact.notes)
                done()
            })
        })
})
describe("PUT /contacts/:id",() => {
    const sendContact = {
        id : 0,
        name: 'www', 
        email: 'www@www.com', 
        phone: '123-456-7890', 
        url: 'www.google.com', 
        notes: 'www'
    }
    it(`should return http status 200 #when send contact to update to contact id 0`,(done) => {
        
        request(app).put("/contacts/0")
            .send(sendContact)
            .expect(200) //เช็ค status
            .then((res) => {
                done()
            })

    })
    it(`update contact id 0 to Contact send`,(done)=>{
        request(app).get("/contacts/0")
            .expect(200)
            .then((res) => {
                let contact = res.body
                expect(contact).toEqual(sendContact) //เช็ค ว่า contact นั้น ถูก update แล้วจริงๆ
                done()
            })
    })
    
})
describe(`delete /contacts/:id`,() => {
    it(`should return HTTP Status 204 #when call HTTP DELETE /contacts/12`,(done) => {

        request(app).delete("/contacts/12")
            .expect(204) //เช็ค status
            .then((res) => {
                done()
            })
    })
    it(`should delete contact id 12`,(done) => {
        request(app).get("/contacts/12")
            .expect(200)
            .then((res) => {
                let contact = res.body
                expect(contact).toBe("") //เช็ค ว่า contact นั้น โดนลบแล้วจริงๆ
                done()
            })
    })
})