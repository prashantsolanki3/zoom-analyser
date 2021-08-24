import React, {useEffect, useState}  from 'react';
import { Grid, Typography } from '@material-ui/core';
import { Image } from '../components';
import ApplicationWrapper from '../bricks/ApplicationWrapper';

const Component = () => { 
    const [url, setUrl] = useState(null)

    const makeLink = () => {
        const thisUrl = new URL('https://zoom.us/oauth/authorize')
        thisUrl.searchParams.set('response_type', 'code')
        thisUrl.searchParams.set('redirect_uri', process.env.NEXT_PUBLIC_NGROK_URL)
        thisUrl.searchParams.set('client_id', process.env.NEXT_PUBLIC_ZOOM_CLIENT)
        setUrl(thisUrl.href)
    }

    useEffect(() => {
        makeLink()
    }, [])

    return (<Grid container justifyContent='flex-start' direction='column' alignItems='center'>
        <Grid item xs={12} xl={2} lg={4} md={6} sm={8}>
            <Image src={'https://cdn4.iconfinder.com/data/icons/robot-avatars-flat/60/028_-_404_bot-512.png'} />
        </Grid>
        <Grid item xs={12} xl={12} lg={12} md={12} sm={12}>
            <Typography variant="body2" align="center" >
            Start Zoom OAuth Process
            </Typography>
        </Grid>
    </Grid>);
}

const Export = () => {
    return <ApplicationWrapper>
        <Component/>
    </ApplicationWrapper>
}


export default Export;