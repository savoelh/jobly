const express = require("express");
const url = require("url")
const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const jsonschema = require("jsonschema")
const jobNewSchema = require("../schemas/jobNew.json")
const Job = require("../models/jobs")
const router = new express.Router();

router.post("/", ensureAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, jobNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs)
        }
        const job = await Job.create(req.body);
        return res.status(201).json({ job })
    } catch (err) {
        next(err)
    }
})

router.get("/", async function (req, res, next) {
    try {
        const searchTerms = url.parse(req.url, true).query
        const job = await Job.getAll(searchTerms)
        return res.json({ job })
    } catch (err) {
        next(err)
    }
})

router.get("/:title", async function (req, res, next) {
    try {
        const job = await Job.get(req.params.title)
        return res.json({ job })
    } catch (err) {
        next(err)
    }
})

router.patch("/:title", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, jobNewSchema)
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs)
        }
        const job = await Job.update(req.params.title, req.body)
        return res.json({ job })
    } catch (err) {
        next(err)
    }
})

// router.delete()

module.exports = router;