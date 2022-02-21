import React from 'react';

import Layout from 'components/Layout';
import TrackedPage from 'components/pages/TrackedPage';

const P = ({ children }: { children: string | (string | JSX.Element)[] }) => (
    <p style={{ marginTop: '10px', marginBottom: '10px' }}>{children}</p>
);

const Strong = ({ children }: { children: string }) => <strong style={{ fontWeight: 'bold' }}>{children}</strong>;

const titleStyle = {
    fontSize: '2em',
    marginTop: '15px',
};

const PrivacyPolicy = () => (
    <TrackedPage name="PrivacyPolicy">
        <Layout>
            <div className="container-fluid" style={{ paddingTop: '4em', paddingBottom: '4em' }}>
                <P>Effective date: July 01, 2014</P>

                <P>Welcome to Krak, the best way to learn tricks on your phone.</P>

                <P>
                    Krak Skateboarding Inc. (<Strong>Krak</Strong>, “we”, “us” or “our”) operates mobile app Krak that
                    is available in Apple App Store and Google Play and several websites including skatekrak.com,
                    map.skatekrak.com, mag.skatekrak.com and box.skatekrak.com. It is Krak's policy to respect your
                    privacy regarding any information we may collect while operating our mobile app and websites.
                </P>

                <ul>
                    <li>
                        Our Privacy Policy explains how we and some of the companies we work with collect, use, share
                        and protect information in relation to our mobile services, web site, and any software provided
                        on or in connection with Instagram services (collectively, the "<Strong>Service</Strong>"), and
                        your choices about the collection and use of your information.
                    </li>
                    <li>
                        By using our Service you understand and agree that we are providing a platform for you to post
                        content, including photos, comments and other materials ("<Strong>User Content</Strong>"), to
                        the Service and to share User Content publicly. This means that other Users may search for, see,
                        use, or share any of your User Content that you make publicly available through the Service,
                        consistent with the terms and conditions of this Privacy Policy.
                    </li>
                    <li>
                        Our Policy applies to all visitors, users, and others who access the Service ("
                        <Strong>Users</Strong>").
                    </li>
                </ul>

                <h2 style={titleStyle}>Users and Website Visitors</h2>

                <P>
                    Like most website and mobile apps operators, Krak collects non-personally-identifying information of
                    the sort that web browsers and servers typically make available, such as the browser type, language
                    preference, referring site, and the date and time of each visitor request. Krak’s purpose in
                    collecting non-personally identifying information is to better understand how Krak’s visitors use
                    its website. From time to time, Krak may release non-personally-identifying information in the
                    aggregate, e.g., by publishing a report on trends in the usage of its website.
                </P>

                <P>
                    Krak also collects potentially personally-identifying information like Internet Protocol (IP)
                    addresses for logged in users and for users leaving comments in Krak App. Krak don’t discloses
                    logged in user and commenter IP addresses for anyone except Krak administrators.
                </P>

                <h2 style={titleStyle}>Gathering of Personally-Identifying Information</h2>

                <P>
                    Certain visitors to Krak’s websites choose to interact with Krak in ways that require Krak to gather
                    personally-identifying information. The amount and type of information that Krak gathers depends on
                    the nature of the interaction. In each case, Krak collects such information only insofar as is
                    necessary or appropriate to fulfill the purpose of the visitor’s interaction with Krak. Krak does
                    not disclose personally-identifying information other than as described below. And visitors can
                    always refuse to supply personally-identifying information, with the caveat that it may prevent them
                    from engaging in certain website-related activities.
                </P>

                <h2 style={titleStyle}>Aggregated Statistics</h2>

                <P>
                    Krak may collect statistics about the behavior of visitors to its websites and Krak App. For
                    instance, Krak may monitor the most popular media content shared in Krak App. Krak may display this
                    information publicly or provide it to others. However, Krak does not disclose personally-identifying
                    information other than as described below.
                </P>

                <h2 style={titleStyle}>Protection of Certain Personally-Identifying Information</h2>

                <P>
                    Krak discloses potentially personally-identifying and personally-identifying information only to
                    those of its employees, contractors and affiliated organizations that (i) need to know that
                    information in order to process it on Krak’s behalf or to provide services available at Krak’s
                    websites and Krak App, and (ii) that have agreed not to disclose it to others. Some of those
                    employees, contractors and affiliated organizations may be located outside of your home country; by
                    using Krak App and Krak’s websites, you consent to the transfer of such information to them. Krak
                    will not rent or sell potentially personally-identifying and personally-identifying information to
                    anyone. Other than to its employees, contractors and affiliated organizations, as described above,
                    Krak discloses potentially personally-identifying and personally-identifying information only in
                    response to a subpoena, court order or other governmental request, or when Krak believes in good
                    faith that disclosure is reasonably necessary to protect the property or rights of Krak, third
                    parties or the public at large. If you are a registered user of an Krak App or Krak website and have
                    supplied your email address, Krak may occasionally send you an email to tell you about new features,
                    solicit your feedback, or just keep you up to date with what’s going on with Krak and our products.
                    We primarily use our various product blogs to communicate this type of information, so we expect to
                    keep this type of email to a minimum. If you send us a request (for example via a support email or
                    via one of our feedback mechanisms), we reserve the right to publish it in order to help us clarify
                    or respond to your request or to help us support other users. Krak takes all measures reasonably
                    necessary to protect against the unauthorized access, use, alteration or destruction of potentially
                    personally-identifying and personally-identifying information.
                </P>

                <h2 style={titleStyle}>Minimum age</h2>

                <h3 style={{ fontSize: '1.2em', marginTop: '10px' }}>Children under 13</h3>

                <P>
                    The minimum age for members is 13. Please do not try to become a member if you are younger than 13.
                    If you are under 13 and have joined we will delete your information as soon as possible after
                    learning this. Please advise us if you believe we have personal information relating to a person
                    younger than 13.
                </P>

                <h3 style={{ fontSize: '1.2em', marginTop: '10px' }}>Parents' permission</h3>

                <P>
                    Minors 13 years or older must ask their parents' permission before providing personal information to
                    us on the internet. Personal information placed on the Website will, subject to any privacy
                    preferences set by you, be available on the internet.
                </P>

                <h2 style={titleStyle}>Cookies</h2>

                <P>
                    A cookie is a string of information that a website stores on a visitor’s computer, and that the
                    visitor’s browser provides to the website each time the visitor returns. Krak uses cookies to help
                    Krak identify and track visitors, their usage of Krak website, and their website access preferences.
                    Krak visitors who do not wish to have cookies placed on their computers should set their browsers to
                    refuse cookies before using Krak’s websites, with the drawback that certain features of Krak’s
                    websites may not function properly without the aid of cookies.
                </P>

                <h2 style={titleStyle}>Business Transfers</h2>

                <P>
                    If Krak, or substantially all of its assets, were acquired, or in the unlikely event that Krak goes
                    out of business or enters bankruptcy, user information would be one of the assets that is
                    transferred or acquired by a third party. You acknowledge that such transfers may occur, and that
                    any acquirer of Krak may continue to use your personal information as set forth in this policy.
                </P>

                <h2 style={titleStyle}>Privacy Policy Changes</h2>

                <P>
                    Although most changes are likely to be minor, Krak may change its Privacy Policy from time to time,
                    and in Krak’s sole discretion. Krak encourages visitors to frequently check this page for any
                    changes to its Privacy Policy. Your continued use of this site after any change in this Privacy
                    Policy will constitute your acceptance of such change.
                </P>

                <h2 style={titleStyle}>About this Privacy Policy</h2>

                <P>
                    This privacy policy is available under a{' '}
                    <a href="http://creativecommons.org/licenses/by-sa/2.5/" target="_blank" rel="noreferrer">
                        Creative Commons Sharealike
                    </a>{' '}
                    license, which means you’re more than welcome to steal it and repurpose it for your own use, just
                    make sure to replace references to us with ones to you.
                </P>

                <P>
                    We deeply respect{' '}
                    <a href="http://automattic.com/" target="_blank" rel="noreferrer">
                        Automattic
                    </a>{' '}
                    for sharing the original version of this Privacy Policy. Thanks, Automattic!
                </P>
            </div>
        </Layout>
    </TrackedPage>
);

export default PrivacyPolicy;
