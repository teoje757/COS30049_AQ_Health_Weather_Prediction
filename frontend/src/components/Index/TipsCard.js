// components/TipsCard.js
import React from 'react';
import { Container, Typography, Grid, Card, CardMedia, Grow, Box } from '@mui/material';

const TipsCard = () => {
  return (
    <Container sx={{ mt: 8, textAlign: 'left', overflow: 'hidden', height: '450px' }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'black', fontWeight: 'bold', mb: 4 }}>
        Clear Air, Clear Mind
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {[
          { title: 'Houseplants', img: '/images/houseplant.jpg', color: '#06CE88', url: 'https://www.sciencealert.com/common-houseplants-can-make-a-real-difference-to-indoor-air-quality'},
          { title: 'Carpooling', img: '/images/carpooling.jpg', color: '#B6D9E2', url: 'https://sustainablyforward.com/benefits-of-carpooling-for-the-environment/'},
          { title: 'Community Clean Up', img: '/images/cleanup.jpg', color: '#F28C28', url: 'https://earthwatch.org/stories/air-quality-community-engagement-helps-make-invisible-visible' },
          { title: 'Eco-Friendly Products', img: '/images/ecofriendly.jpeg', color: '#7E6E67', url: 'https://airqualityeducator.com/eco-friendly-products-and-air-pollution/' },
        ].map((tip, index) => (
          <Grow in={true} timeout={(index + 1) * 500} key={tip.title}>
            <Grid item xs={12} sm={6} md={3}>
              <a href={tip.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <Card
                    sx={{
                      height: 350,
                      borderRadius: 4,
                      position: 'relative',
                      overflow: 'hidden',
                      transform: 'scale(1)',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      alt={tip.title}
                      image={tip.img}
                      sx={{
                        height: '100%',
                        width: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        height: '100%',
                        width: '100%',
                        background: `linear-gradient(to top, ${tip.color} 40%, transparent 100%)`,
                        borderRadius: 4,
                        transition: 'opacity 0.3s ease',
                        opacity: 0.5,
                        '&:hover': {
                          opacity: 0.4,
                        },
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 16,
                        width: '100%',
                        textAlign: 'center',
                        color: 'white',
                      }}
                    >
                      <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                        {tip.title}
                      </Typography>
                    </Box>
                  </Card>
                </a>
            </Grid>
          </Grow>
        ))}
      </Grid>
    </Container>
  );
};

export default TipsCard;
