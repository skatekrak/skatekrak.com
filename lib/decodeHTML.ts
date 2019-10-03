export default function decodeHTML(str: string) {
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    txt.remove();
    return txt.value;
}
