import React, {useEffect, useState}  from 'react';
import { Grid, Typography, Link } from '@material-ui/core';
import { Image } from '../components';
import ApplicationWrapper from '../bricks/ApplicationWrapper';

const Component = () => { 
    const [url, setUrl] = useState(null)

    const makeLink = () => {
        const thisUrl = new URL('https://zoom.us/oauth/authorize')
        thisUrl.searchParams.set('response_type', 'code')
        thisUrl.searchParams.set('redirect_uri', process.env.NEXT_PUBLIC_REDIRECT_URL)
        thisUrl.searchParams.set('client_id', process.env.NEXT_PUBLIC_ZOOM_CLIENT_ID)
        setUrl(thisUrl.href)
    }

    useEffect(() => {
        makeLink()
    }, [])

    return (<Grid container justifyContent='flex-start' direction='column' alignItems='center'>
        <Grid item xs={12} xl={12} lg={12} md={12} sm={12}>
            <Typography variant="body2" align="center" >
            <Link
              style={{
                pointer: 'cursor'
              }}
              color="textSecondary"
              href={url}
              variant="body2"
            >
              Start Zoom OAuth Process
            </Link>
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