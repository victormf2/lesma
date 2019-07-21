var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var BETWEEN_PARENTHESIS = /\(\s*(.*?)\s*\)(?:\s*\{)/s;
var ARGUMENT_NAMES = /([a-zA-Z$_]\w*)\s*(=.*)?(,|$)/gm;
export interface ParamInfo {
    name: string,
    hasDefaultValue: boolean;
}
export function getParamInfos(func: Function): ParamInfo[] {
    const paramInfos: ParamInfo[] = [];
    const fnStr = func.toString().replace(STRIP_COMMENTS, '');
    const paramsStr = fnStr.match(BETWEEN_PARENTHESIS)[1];
    let result = ARGUMENT_NAMES.exec(paramsStr);
    while (result) {
        const info: ParamInfo = {
            name: result[1],
            hasDefaultValue: !!result[2]
        };
        paramInfos.push(info);
        result = ARGUMENT_NAMES.exec(paramsStr);
    }
    return paramInfos;
}