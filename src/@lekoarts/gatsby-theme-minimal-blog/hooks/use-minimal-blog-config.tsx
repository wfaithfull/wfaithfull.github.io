import { graphql, useStaticQuery } from "gatsby"
import React from "react"

type UseMinimalBlogConfigProps = {
  minimalBlogConfig: {
    basePath: string
    blogPath: string
    postsPath: string
    pagesPath: string
    tagsPath: string
    externalLinks: {
      name: string
      url: string
    }[]
    navigation: {
      title: string
      slug: string
    }[]
    showLineNumbers: boolean
  }
}

const useMinimalBlogConfig = () => {
    React.useEffect(() => {
        MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
      }, [])
  const data = useStaticQuery<UseMinimalBlogConfigProps>(graphql`
    query {
      minimalBlogConfig {
        basePath
        blogPath
        postsPath
        pagesPath
        tagsPath
        externalLinks {
          name
          url
        }
        navigation {
          title
          slug
        }
        showLineNumbers
      }
    }
  `)

  return data.minimalBlogConfig
}

export default useMinimalBlogConfig