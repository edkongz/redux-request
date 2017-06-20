"use strict"

import test from "ava"
import * as utils from "../lib/utils.js"

test("should build path and add empty options", t => {
  let input = ["one", "two"]
  let actual = utils.parseRequestArgs(input)
  let expected = { _path: "one/two", _options: {}}
  t.deepEqual(actual, expected)
})

test("should build path and keep options", t => {
  let input = ["one", "two", { key: "value" }]
  let actual = utils.parseRequestArgs(input)
  let expected = {_path: "one/two", _options: { key: "value"}}
  t.deepEqual(actual, expected)
})

console.log(utils.buildAction("PROJECTS", "INIT"))
