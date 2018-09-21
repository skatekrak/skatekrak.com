import React from 'react';

import '../styles/bootstrap.min.css';
import '../styles/style.css';

const svgStyles = {
    width: "30px"
};

const storesStyles = {
    width: "150px"
};

const footerTitleStyles = {
    fontSize: "1.0em"
}

const hrStyles = {
    border: "1px solid #eee",
}

export default class extends React.PureComponent {
    state = {
        lang: undefined,
        success: false,
        error: undefined,
    }

    componentDidMount() {
        const { language } = window.navigator;
        this.setState({ lang: language.substring(0, 2) });

        
        (function(e,t){var n=e.amplitude||{_q:[],_iq:{}};var r=t.createElement("script")
            ;r.type="text/javascript";r.async=true
            ;r.src="https://cdn.amplitude.com/libs/amplitude-4.4.0-min.gz.js"
            ;r.onload=function(){if(e.amplitude.runQueuedFunctions){
            e.amplitude.runQueuedFunctions()}else{
            console.log("[Amplitude] Error: could not load SDK")}}
            ;var i=t.getElementsByTagName("script")[0];i.parentNode.insertBefore(r,i)
            ;function s(e,t){e.prototype[t]=function(){
            this._q.push([t].concat(Array.prototype.slice.call(arguments,0)));return this}}
            var o=function(){this._q=[];return this}
            ;var a=["add","append","clearAll","prepend","set","setOnce","unset"]
            ;for(var u=0;u<a.length;u++){s(o,a[u])}n.Identify=o;var c=function(){this._q=[]
            ;return this}
            ;var l=["setProductId","setQuantity","setPrice","setRevenueType","setEventProperties"]
            ;for(var p=0;p<l.length;p++){s(c,l[p])}n.Revenue=c
            ;var d=["init","logEvent","logRevenue","setUserId","setUserProperties","setOptOut","setVersionName","setDomain","setDeviceId","setGlobalUserProperties","identify","clearUserProperties","setGroup","logRevenueV2","regenerateDeviceId","logEventWithTimestamp","logEventWithGroups","setSessionId","resetSessionId"]
            ;function v(e){function t(t){e[t]=function(){
            e._q.push([t].concat(Array.prototype.slice.call(arguments,0)))}}
            for(var n=0;n<d.length;n++){t(d[n])}}v(n);n.getInstance=function(e){
            e=(!e||e.length===0?"$default_instance":e).toLowerCase()
            ;if(!n._iq.hasOwnProperty(e)){n._iq[e]={_q:[]};v(n._iq[e])}return n._iq[e]}
            ;e.amplitude=n})(window,document);

        amplitude.getInstance().init("43ffd8f485e58ffd19981b20655eb33a");
        amplitude.getInstance().logEvent("page_view", { page: "home"});
    }

    subscribeToNewsletter = (event) => {
        event.preventDefault();

        this.setState({ success: false, error: undefined });

        const email = event.target[0].value;
        console.log("email", email);
        const request = new Request(process.env.BARDE_URL + "/emails", {
            method: "POST",
            body: JSON.stringify({ email }),
            headers: new Headers({
                "Content-Type": "application/json"
            })
        });
        fetch(request)
        .then((res) => {
            if (res.ok) {
                this.setState({ success: true });
            }
            else {
                this.setState({ error: true });
            }
        })
    }

    render() {
        return (
            <main>
                <div className="pb-5" style={{
                    backgroundColor: "white",
                    backgroundSize: "cover",
                    color: "white",
                    backgroundImage: "url('/static/lucas_background_with_overlay.jpg')",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center"
                }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-sm">
                                <div className="mt-5 mb-5" style={{ textAlign: "center" }}>
                                    <img src="/static/KRAK-Logo-RGB-Inline-COLOUR-LR.png" alt="krakbox logo" width="400px" />
                                </div>
                                <div>
                                    <p>
                                        Few years ago, we launched KRAK, a social network for skateboarders based on a worldwide map of spots.
                                    </p>
                                    <p>
                                        From the small curb next to your house to the most famous spots (but also including skateparks, diy or skateshops) you're able to add every kind of skateable obstacle or skate-related places you can find and add some content.
                                    </p>
                                    <p>
                                        We see it as a way to keep track of the skateboarding history over the years. From this angle we try our best to reference the tricks from the past that made what skateboarding is today.
                                    </p>
                                    <p>
                                        We're working on the web experience right now and we need your help. If you wanna test the current prototype - give us your feedback - help us improve the whole thing: just ask us.
                                    </p>
                                    <p>
                                        Few ways:
                                    </p>
                                    <ul>
                                        <li>send an email to this address: <a href="mailto:app@skatekrak.com">app@skatekrak.com</a></li>
                                        <li>ask us by DM on <a href="https://instagram.com/skate_krak" target="_blank" rel="noopener">Instagram</a></li>
                                        <li>ask us by messenger on <a href="https://facebook.com/skatekrak" target="_blank" rel="noopener">Facebook</a></li>
                                    </ul>
                                    <p>
                                        You rock - peace!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <footer className="pt-4" style={{
                    backgroundColor: "black",
                    color: "white",
                }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-sm column">
                                <div className="row">
                                    <div className="col-sm">
                                        <h4 style={footerTitleStyles}>FOLLOW US</h4>
                                        <hr style={hrStyles} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm">
                                        <a href="https://facebook.com/skatekrak" target="_blank" rel="noopener" aria-label="Facebook page">
                                            <svg aria-hidden="true" data-prefix="fab" data-icon="facebook" style={svgStyles} className="svg-inline--fa fa-facebook fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="white" d="M448 56.7v398.5c0 13.7-11.1 24.7-24.7 24.7H309.1V306.5h58.2l8.7-67.6h-67v-43.2c0-19.6 5.4-32.9 33.5-32.9h35.8v-60.5c-6.2-.8-27.4-2.7-52.2-2.7-51.6 0-87 31.5-87 89.4v49.9h-58.4v67.6h58.4V480H24.7C11.1 480 0 468.9 0 455.3V56.7C0 43.1 11.1 32 24.7 32h398.5c13.7 0 24.8 11.1 24.8 24.7z"></path></svg>
                                        </a>
                                        <a href="https://twitter.com/skatekrak" className="ml-2" target="_blank" rel="noopener" aria-label="Twitter page">
                                            <svg aria-hidden="true" data-prefix="fab" data-icon="twitter-square" style={svgStyles} className="svg-inline--fa fa-twitter-square fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="white" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-48.9 158.8c.2 2.8.2 5.7.2 8.5 0 86.7-66 186.6-186.6 186.6-37.2 0-71.7-10.8-100.7-29.4 5.3.6 10.4.8 15.8.8 30.7 0 58.9-10.4 81.4-28-28.8-.6-53-19.5-61.3-45.5 10.1 1.5 19.2 1.5 29.6-1.2-30-6.1-52.5-32.5-52.5-64.4v-.8c8.7 4.9 18.9 7.9 29.6 8.3a65.447 65.447 0 0 1-29.2-54.6c0-12.2 3.2-23.4 8.9-33.1 32.3 39.8 80.8 65.8 135.2 68.6-9.3-44.5 24-80.6 64-80.6 18.9 0 35.9 7.9 47.9 20.7 14.8-2.8 29-8.3 41.6-15.8-4.9 15.2-15.2 28-28.8 36.1 13.2-1.4 26-5.1 37.8-10.2-8.9 13.1-20.1 24.7-32.9 34z"></path></svg>
                                        </a>
                                        <a href="https://instagram.com/skate_krak" className="ml-2" target="_blank" rel="noopener" aria-label="Instagram page">
                                            <svg aria-hidden="true" data-prefix="fab" data-icon="instagram" style={svgStyles} className="svg-inline--fa fa-instagram fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="white" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path></svg>
                                        </a>
                                        <a href="https://www.youtube.com/krakskate" className="ml-2" target="_blank" rel="noopener" aria-label="Youtube page">
                                            <svg aria-hidden="true" data-prefix="fab" data-icon="youtube-square" style={svgStyles} className="svg-inline--fa fa-youtube-square fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="white" d="M186.8 202.1l95.2 54.1-95.2 54.1V202.1zM448 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352c26.5 0 48 21.5 48 48zm-42 176.3s0-59.6-7.6-88.2c-4.2-15.8-16.5-28.2-32.2-32.4C337.9 128 224 128 224 128s-113.9 0-142.2 7.7c-15.7 4.2-28 16.6-32.2 32.4-7.6 28.5-7.6 88.2-7.6 88.2s0 59.6 7.6 88.2c4.2 15.8 16.5 27.7 32.2 31.9C110.1 384 224 384 224 384s113.9 0 142.2-7.7c15.7-4.2 28-16.1 32.2-31.9 7.6-28.5 7.6-88.1 7.6-88.1z"></path></svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm column">
                                <div className="row">
                                    <div className="col-sm">
                                        <h4 style={footerTitleStyles}>DOWNLOAD THE APP</h4>
                                        <hr style={hrStyles} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm">
                                        <a href="https://play.google.com/store/apps/details?id=com.krak" target="_blank" aria-label="Go to google playstore" rel="noopener">
                                            <img style={storesStyles} src="/static/icons/download_playstore.svg" alt="Playstore logo" />
                                        </a>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm">
                                        <a href="https://itunes.apple.com/us/app/krak/id916474561" target="_blank" aria-label="Go to Appstore" rel="noopener">
                                            <img style={storesStyles} className="mt-2" src="/static/icons/download_appstore_white.png" alt="Appstore logo" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm column">
                                <div className="row">
                                    <div className="col-sm">
                                        <h4 style={footerTitleStyles}>STAY TUNED</h4>
                                        <hr style={hrStyles} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm">
                                        {this.state.success &&
                                            <div className="alert alert-success mt-2" role="alert">
                                                We sent you an email to confirm your subscription
                                            </div>
                                        }
                                        {this.state.error && (
                                            <div className="alert alert-danger mt-2" role="alert">
                                                Something went wrong, try again later
                                            </div>
                                        )}
                                        <form onSubmit={this.subscribeToNewsletter}>
                                            <div className="form-group">
                                                <label htmlFor="emailInput">Left your email to stay tuned</label>
                                                <input type="email" className="form-control" id="emailInput" placeholder="love@skatekrak.com" />
                                            </div>
                                            <button type="submit" className="btn btn-default" aria-label="Send">Send</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
        );
    }
}