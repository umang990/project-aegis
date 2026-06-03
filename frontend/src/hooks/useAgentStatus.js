import { useState, useEffect } from 'react';

export function useAgentStatus() {
    const [status, setStatus] = useState('active');
    return status;
}
