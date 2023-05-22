export default function randomString(l : number){
    const chars : string = "ABCDEFGHIJKLMNOPQRSTUVWXYZahjdfahsdgfasytddl.f";
    let str : string = "";
    for (let i = 0; i < l; i++) {
        const char = chars[Math.floor(Math.random() * chars.length - 1)]
        str += char;
    }

    return str;
}