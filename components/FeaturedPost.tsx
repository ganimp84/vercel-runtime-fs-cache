import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Post } from '../types/post';

interface FeaturedPostProps {
    post: Post;
}

export default function FeaturedPost(props: FeaturedPostProps) {
    const { post } = props;

    const randomDate = (start: Date, end: Date) => {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    return (
        <Grid item xs={12} md={6}>
            <CardActionArea component="a" href="#">
                <Card sx={{ display: 'flex' }}>
                    <CardContent sx={{ flex: 1 }}>
                        <Typography component="h2" variant="h5">
                            {post.title}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            {randomDate(new Date(2012, 0, 1), new Date()).toDateString()}
                        </Typography>
                        <Typography variant="subtitle1" paragraph>
                            {post.body}
                        </Typography>
                        <Typography variant="subtitle1" color="primary">
                            Continue reading...
                        </Typography>
                    </CardContent>
                    <CardMedia
                        component="img"
                        sx={{ width: 160, display: { xs: 'none', sm: 'block' } }}
                        image="https://source.unsplash.com/random"
                        alt={post.title}
                    />
                </Card>
            </CardActionArea>
        </Grid>
    );
}