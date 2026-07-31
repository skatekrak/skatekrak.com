import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { useField } from 'formik';

import IconEdit from '@/components/Ui/Icons/IconEdit';
import IconPlus from '@/components/Ui/Icons/IconPlus';
import Typography from '@/components/Ui/typography/Typography';
import { orpc } from '@/server/orpc/client';
import { useSettingsStore } from '@/store/settings';

type Props = {
    handleToggleMapVisible: () => void;
};

const MapCreateSpotLocation = ({ handleToggleMapVisible }: Props) => {
    const [{ value }] = useField<{ latitude: number | undefined; longitude: number | undefined }>('location');

    const hasLocation = value != null && value.latitude != null && value.longitude != null;

    const { data } = useQuery(
        orpc.spots.reverseGeocode.queryOptions({
            input: { latitude: value?.latitude ?? 0, longitude: value?.longitude ?? 0 },
            enabled: hasLocation,
        }),
    );

    const isMobile = useSettingsStore((state) => state.isMobile);

    return (
        <button
            type="button"
            className={classNames('relative w-full p-6 text-left tablet:px-8 tablet:py-5', {
                'pointer-events-none': !isMobile,
            })}
            onClick={handleToggleMapVisible}
        >
            {hasLocation && data != null ? (
                <div className="flex">
                    <div className="mr-4 text-onDark-highEmphasis [&_.ui-Typography:last-child]:mt-1 [&_.ui-Typography:last-child]:uppercase">
                        <Typography>
                            {data.streetNumber} {data.streetName}
                        </Typography>
                        <Typography>
                            {data.city}, {data.country}
                        </Typography>
                    </div>
                    {isMobile && (
                        <div className="ml-auto text-onDark-mediumEmphasis">
                            <div className="flex items-center text-onDark-mediumEmphasis [&_.ui-Typography]:shrink-0 [&_svg]:shrink-0 [&_svg]:w-5 [&_svg]:ml-3 [&_svg]:fill-onDark-mediumEmphasis">
                                <Typography component="button">Edit</Typography>
                                <IconEdit />
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-onDark-mediumEmphasis [&_div]:mb-2">
                    {isMobile ? (
                        <>
                            <div className="flex items-center text-onDark-mediumEmphasis [&_.ui-Typography]:shrink-0 [&_svg]:shrink-0 [&_svg]:w-5 [&_svg]:ml-3 [&_svg]:fill-onDark-mediumEmphasis">
                                <Typography component="button">Add location</Typography>
                                <IconPlus />
                            </div>
                            <Typography component="body2">Select a type to add location</Typography>
                        </>
                    ) : (
                        <>
                            <Typography component="button" className="mb-2">
                                Location
                            </Typography>
                            <Typography component="body2">
                                Select a type and click on the map to display location
                            </Typography>
                        </>
                    )}
                </div>
            )}
        </button>
    );
};

export default MapCreateSpotLocation;
