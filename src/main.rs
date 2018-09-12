#[macro_use]
extern crate stdweb;

fn main() {
    let piyo = |foo: String| -> String {
        [foo, String::from("aiueo")].join(" ")
    };

    js! {
        fetch("https://ipinfo.io").then(resp => resp.text()).then(json => {
            var aba = @{piyo}(json);
            console.log(aba);
        })
    }
}
