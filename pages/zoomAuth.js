import React, {useEffect, useState}  from 'react';
import { Grid, Typography, Link } from '@material-ui/core';
import { withIronSession } from "next-iron-session";
import ApplicationWrapper from '../bricks/ApplicationWrapper';

const Component = ({user, zoomUser, initialZoomCookie}) => { 
    const [url, setUrl] = useState(null)
    const [thisZoomUser, setThisZoomUser] = useState(initialZoomCookie)
    
    console.log(zoomUser)
    console.log(initialZoomCookie)


    const makeLink = () => {

        console.log(`${process.env.NEXT_PUBLIC_REDIRECT_URL} ${process.env.NEXT_PUBLIC_ZOOM_CLIENT_ID}`)

        const thisUrl = new URL('https://zoom.us/oauth/authorize')
        thisUrl.searchParams.set('response_type', 'code')
        thisUrl.searchParams.set('redirect_uri',`${process.env.NEXT_PUBLIC_FRONTEND_HOSTNAME}/zoomAuth`)
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

export const getServerSideProps = withIronSession(
    async ({req, res}) => {
        const user = req.session.get('user')
        const thisUrl = new URL(req.url, `http://${req.headers.host}`)

        const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : null
        const initialZoomCookie = cookies['ZOOMUSER'] ? cookies['ZOOMUSER'] : null
        console.log(initialZoomCookie)
        if (thisUrl.searchParams.get('code')){
            const urlParam = thisUrl.searchParams.get('code')
            console.log(urlParam)

            const data = process.env.NEXT_PUBLIC_ZOOM_CLIENT + ':' + 
                process.env.NEXT_PUBLIC_ZOOM_SECRET
            const newData = Buffer.from(data, 'utf8')
            const b64string = newData.toString('base64')

            const zoomUrl = new URL('https://zoom.us/oauth/token')
            zoomUrl.searchParams.set('grant_type', 'authorization_code')
            zoomUrl.searchParams.set('code', urlParam)
            zoomUrl.searchParams.set('redirect_uri', 
            `${process.env.NEXT_PUBLIC_FRONTEND_HOSTNAME}/zoomAuth`
            )
            
            try {
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + b64string
                    }
                }
                const response = await fetch(zoomUrl.href, options)  
                const json = await response.json()
                console.log(json)

                if (json.access_token){
                    const preUser = await fetch('https://api.zoom.us/v2/users', {
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer ' + json.access_token
                        }
                    })
                    const zoomUser = await preUser.json()
                    console.log(zoomUser)
                    if (!user){
                        res.statusCode = 401
                        return {props: {}}
                    }
                    return {
                        props: {zoomUser, user}
                    }
                }
            }
            catch(e) {
                console.log(e)
            }        
        }

        if (!user){
            res.statusCode = 401
            return {props: {}}
        }
        return {
            props: {user, initialZoomCookie}
        }
    },
    {
        cookieName: "ZOOMHELPERCOOKIE",
        password: process.env.IRON_SESSION_SECRET,
        cookieOptions: {
            secure: process.env.NODE_ENV === 'production' ? true : false
        }
    }
)

const Export = () => {
    return <ApplicationWrapper>
        <Component/>
    </ApplicationWrapper>
}


export default Export;