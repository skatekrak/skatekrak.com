import React from 'react';

import ScrollTop from 'components/Ui/Utils/ScrollTop';

const Menu: React.SFC = () => (
    <div id="videos-menu-container">
        <div id="videos-menu-desc">
            <h1 id="videos-menu-desc-title">
                Your daily dose
                <br />
                of Krak vidz
            </h1>
            <p id="videos-menu-desc-text">
                Krak brings you all the daily videos you need to see. The best of skateboarding vidz at the same place.
                On peut mettre ce qu’on veut ici pas forcement du texte, on rien du tout. Enjoy the show 🤘
            </p>
        </div>
        <ScrollTop elementId="videos-menu-desc" />
    </div>
);

export default Menu;
