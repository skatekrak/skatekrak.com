import * as React from 'react';

import Layout from 'components/Layout/Layout';
import TrackedPage from 'components/pages/Page';

export default () => (
    <TrackedPage name="Congrats">
        <Layout>
            <div id="step3">
                <img id="step3-image" src="/static/images/step_3_2x.png" alt="Kraken illustration step 3" />
                <div id="step3-title">
                    <p id="step3-title-1">💥 Bang 💥</p>
                    <p id="step3-title-2">you're a kraken now!</p>
                </div>
                <p id="step3-support">Welcome to the family, we'll come back to you very soon, k.</p>
            </div>
        </Layout>
    </TrackedPage>
);
