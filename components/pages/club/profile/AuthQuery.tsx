import React from 'react';
import { Query } from 'react-apollo';
import { connect } from 'react-redux';

import { KrakLoading } from 'components/Ui/Icons/Spinners';

import { userSignout } from 'store/auth/actions';

type Props = {
    children: ({ data }: { data: any }) => React.ReactElement;
    query: any;
    userSignout: () => void;
};

class AuthQuery extends React.Component<Props, {}> {
    public render() {
        const { children, query } = this.props;

        return (
            <React.Fragment>
                {query && (
                    <Query query={query}>
                        {({ loading, error, data }) => {
                            if (loading) {
                                return <KrakLoading />;
                            }

                            if (error) {
                                if (error.graphQLErrors[0].message === ERROR_MESSAGE) {
                                    this.props.userSignout();
                                    return <React.Fragment />;
                                } else {
                                    return <pre>{JSON.stringify(error, undefined, 2)}</pre>;
                                }
                            }

                            if (data) {
                                return children({ data });
                            }
                        }}
                    </Query>
                )}
            </React.Fragment>
        );
    }
}

const ERROR_MESSAGE = "Member doesn't exist";

export default connect(
    undefined,
    {
        userSignout,
    },
)(AuthQuery);
