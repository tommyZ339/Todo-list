const memoVersionMap = new Map();


function updateVersion(id) {
    memoVersionMap.set(id, getMemoVersion(id) + 1)
}

function getMemoVersion(id) {
    return memoVersionMap.get(id) || 0;
}


export {updateVersion, getMemoVersion};