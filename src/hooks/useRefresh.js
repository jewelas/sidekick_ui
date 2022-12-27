import { useContext } from 'react';
import { RefreshContext } from 'contexts/RefreshContext';

const useRefresh = () => {
    const { fast, slow, now, superSlow } = useContext(RefreshContext);
    return { fastRefresh: fast, slowRefresh: slow, nowRefresh: now , superSlowRefresh: superSlow};
}

export default useRefresh;