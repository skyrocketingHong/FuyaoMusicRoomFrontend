/**
 * 环境配置
 *
 * @type {string}
 */

let baseUrl = 'http://localhost:3100';

if (process.env.NODE_ENV === "development") {
    baseUrl = "http://localhost:3100";
} else if (process.env.NODE_ENV === "test") {
    baseUrl = "http://localhost:3100";
} else if (process.env.NODE_ENV === "production") {
    baseUrl = "";
}

let isProduction = false;

if (process.env.NODE_ENV === "production") {
    isProduction = true;
}

export {
    baseUrl,
    isProduction
}
