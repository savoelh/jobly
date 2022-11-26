"use strick";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Job {

    static async create({ title, salary, equity, company_handle }) {
        const result = await db.query(`
            INSERT INTO jobs
                (title, salary, equity, company_handle)
                VALUES ($1, $2, $3, $4)
                RETURNING title, salary, equity, company_handle
        `, [title, salary, equity, company_handle])
        const job = result.rows[0];
        return job;
    }

    static async getAll(searchTerms) {
        if (typeof searchTerms !== "undefined") {
            if ('search' || 'minSalary' in searchTerms) {
                const search = searchTerms.search || ""
                const minSalary = searchTerms.minSalary || 0
                const result = await db.query(`
                    SELECT title, salary, equity, company_handle
                    FROM jobs
                    WHERE title LIKE '%${search}%' 
                    AND salary > ${minSalary}
                `)
                return result.rows
            }
        }
        const result = await db.query(`
            SELECT title, salary, equity, company_handle
            FROM jobs
        `)
        return result.rows
    }

    static async getByCompany(company) {
        console.log(company)
        const result = await db.query(`
            SELECT title, salary
            FROM jobs
            WHERE company_handle = '${company}'
        `)
        return result.rows
    }

    static async get(title) {
        const result = await db.query(`
            SELECT title, salary, equity, company_handle
            FROM jobs
            WHERE title = $1
        `, [title])
        const jobs = result.rows
        if (!jobs) throw new NotFoundError(`No jobs found: ${title}`)
        return jobs;
    }
    static async update(title, data) {
        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                salary: "salary",
                equity: "equity"
            })
            const handleVarIndx = "$" + (values.length + 1);
            const querySql = `UPDATE jobs
                                SET ${setCols}
                                WHERE title = ${handleVarIndx}
                                RETURNING title, salary, equity, company_handle
                                `
            const result = await db.query(querySql, [...values, title])
            const job = result.rows[0]
            if (!job) throw new NotFoundError(`No job: ${title}`)
            return job;
    }

    static async remove(title) {
        const result = await db.query(`
            DELETE FROM jobs
            WHERE title = $1
            RETURNING title
        `, [title])
        const job = result.rows[0]
        console.log(job)
        if (!job) throw new NotFoundError(`No job found: ${title}`)
    }
}

module.exports = Job;