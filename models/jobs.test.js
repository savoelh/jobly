const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./jobs.js");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("POST / create", function () {
    const newJob = {
        title: "title",
        salary: 10,
        equity: "0.1",
        company_handle: "c1"
    }
    test("works", async function () {
        let job = await Job.create(newJob)
        expect(job).toEqual(newJob)

        const result = await db.query(`
            SELECT title, salary, equity, company_handle
            FROM jobs
            WHERE title = 'title'
        `)
        expect(result.rows[0]).toEqual(newJob)
    })
})

describe("get", function () {
    test("gets all with no filter", async function () {
        let jobs = await Job.getAll()
        expect(jobs).toEqual([
            {
                title: 'j1',
                salary: 10,
                equity: '0.1',
                company_handle: 'c1'
            },
            {
                title: 'j2',
                salary: 20,
                equity: '0.2',
                company_handle: 'c2'
            }
        ])
    })
    test("gets all with filter", async function () {
        searchTerms = {
            search: "j1"
        }
        let jobs = await Job.getAll(searchTerms)
        expect(jobs).toEqual([{
            title: 'j1',
            salary: 10,
            equity: '0.1',
            company_handle: 'c1'
        }])
    })
    test("gets by title", async function () {
        let result = await Job.get("j1")
        expect(result).toEqual([{
            title: 'j1',
            salary: 10,
            equity: '0.1',
            company_handle: 'c1'
        }])
    })
describe("PATCH / update", function() {
    const updateData = {
        title: 'j5',
        salary: 50,
        equity: '0.5'
    }
    test("updates a job", async function(){
        const result = await Job.update('j1', updateData);
        expect(result).toEqual({
            title: 'j5',
            salary: 50,
            equity: '0.5',
            company_handle: 'c1'
        });
        const job = await db.query(`
            SELECT title, salary, equity, company_handle
            FROM jobs
            WHERE company_handle = 'c1'
        `)
        expect(job.rows[0]).toEqual({
            title: 'j5',
            salary: 50,
            equity: '0.5',
            company_handle: 'c1'
        })
    })
})

describe("DELETE", function() {
    test("works", async function() {
        await Job.remove('j1');
        const result = await db.query(`
            SELECT title, salary, equity, company_handle FROM jobs 
            WHERE title = 'j1'
        `)
        expect(result.rows.length).toEqual(0)
    })
})
})

