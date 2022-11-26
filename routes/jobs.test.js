const request = require("supertest");

const db = require("../db");
const app = require("../app");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    u2Token
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("POST /jobs", function () {
    const newJob = {
        "title": "title",
        "salary": 90,
        "equity": "0.9",
        "company_handle": "c1"
    }
    test("can create job", async function () {
        const resp = await request(app)
            .post("/jobs")
            .send(newJob)
            .set("authorization", `Bearer ${u1Token}`)
        expect(resp.statusCode).toEqual(201)
        expect(resp.body).toEqual({
            job: newJob
        })
    })
})

describe("GET /jobs", function () {
    test("gets all jobs", async function () {
        const resp = await request(app)
            .get("/jobs")

        expect(resp.body).toEqual({
            job: [
                {
                    "title": "title1",
                    "salary": 10,
                    "equity": "0.1",
                    "company_handle": "c1"
                },
                {
                    "title": "title2",
                    "salary": 20,
                    "equity": "0.2",
                    "company_handle": "c2"
                },
                {
                    "title": "title3",
                    "salary": 30,
                    "equity": "0.3",
                    "company_handle": "c3"
                }
            ]
        })
    })
    test("gets job by query", async function () {
        const resp = await request(app).get("/jobs?search=title1")
        expect(resp.body).toEqual({
            job: [
                {
                    "title": "title1",
                    "salary": 10,
                    "equity": "0.1",
                    "company_handle": "c1"
                }
            ]
        })
    })
    test("gets job by salary", async function () {
        const resp = await request(app).get("/jobs?minSalary=29")
        expect(resp.body).toEqual({
            job: [
                {
                    "title": "title3",
                    "salary": 30,
                    "equity": "0.3",
                    "company_handle": "c3"
                }
            ]
        })
    })
    test("gets job by title", async function () {
        const resp = await request(app).get("/jobs/title2")
        expect(resp.body).toEqual({
            job: [
                {
                    "title": "title2",
                    "salary": 20,
                    "equity": "0.2",
                    "company_handle": "c2"
                }
            ]
        })
    })
})
describe("PATCH /jobs", function () {
    const newData = {
        title: "title1",
        salary: 90,
        equity: "0.9",
        company_handle: "c1"
    }
    test("patch works", async function () {
        const resp = await request(app)
            .patch("/jobs/title1")
            .send(newData)
            .set("authorization", `Bearer ${u1Token}`)
        expect(resp.body).toEqual({
            job: {
                title: "title1",
                salary: 90,
                equity: "0.9",
                company_handle: "c1"
            }
        })
    })
})