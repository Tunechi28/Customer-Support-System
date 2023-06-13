describe("BigInt polyfill", () => {
    it("JSON.stringify works when imported", async () => {
        require("./bigint");
        expect(JSON.stringify({ x: BigInt("2") })).toBeTruthy();
    });
});
