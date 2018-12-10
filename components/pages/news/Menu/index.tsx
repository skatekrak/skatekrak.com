import * as React from 'react';

import Sources from 'components/pages/news/Menu/Sources';

type Props = {
    sourcesMenuIsOpen: boolean;
    handleOpenSourcesMenu: () => void;
};

const Menu: React.SFC<Props> = ({ sourcesMenuIsOpen, handleOpenSourcesMenu }) => (
    <div id="news-menu-container" className="col-xs-12 last-md col-md-4 col-lg-3">
        <Sources sourcesMenuIsOpen={sourcesMenuIsOpen} handleOpenSourcesMenu={handleOpenSourcesMenu} />
    </div>
);

export default Menu;
