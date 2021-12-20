let escapeHtml = function(unsafe) {
    let result
    try {
        result = unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    } catch(e) {
        result = "Hibás bevitel"
    }
    return result
    }


module.exports = escapeHtml
