import React, {useEffect} from 'react';
import { useStoreState } from 'easy-peasy';

import FeedbackForm from '../../dapp-components/Feedback/Form';
export default function Feedback() {
    const { firebase } = useStoreState((state) => state.Dapp);
    useEffect(() => {
      if (firebase !== null && firebase !== undefined) {
        firebase.analytics.logEvent('page_view');
      }
    }, [firebase]);


    return (
        <>
            <div>
                <FeedbackForm />
            </div>
        </>
    );
}
