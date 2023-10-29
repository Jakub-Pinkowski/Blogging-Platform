import Head from 'next/head'

export default function Metatags({
    title = 'Blogging Platform',
    description = 'A social-media blogging platform',
}) {
    return (
        <Head>
            <title>{title}</title>
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:site" content="@fireship_dev" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />

            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
        </Head>
    )
}
