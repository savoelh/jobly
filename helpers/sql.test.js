const { sqlForPartialUpdate } = require("./sql.js")

describe("sql formater", function () {
    test("sql formation", function () {
        const result = sqlForPartialUpdate({ numEmployees: 15 }, { numEmployees: 'num_employees' })
        console.log(result)
        expect(result).toEqual({
            setCols: '"num_employees"=$1',
            values: [15]
        });
    });
})